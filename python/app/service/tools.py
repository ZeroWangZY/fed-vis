from scipy.spatial import distance
from scipy.stats import wasserstein_distance
import numpy as np

def calc_are(p, q):
    length = np.size(p)
    ret = 0.0
    for i in range(0, length):
        a = p[i]
        b = q[i]
        abs_diff = abs(a - b)
        max_val = max(a, b)
        ret += abs_diff / max_val if max_val != 0 else 0
    return ret / length


def test_accuracy(p, q):
    if len(p) == 0 or len(q) == 0:
        return 0
    p = np.array(p).flatten()
    q = np.array(q).flatten()
    # print(p,q)
    JSD = distance.jensenshannon(p, q, 2.0)
    EMD = wasserstein_distance(p, q)
    ARE = calc_are(p, q)

    diff = np.abs(p - q)
    max_sum = q.sum() if q.sum() > p.sum() else p.sum()

    print("accuray: JSD - {}; EMD - {}, ARE - {}, zyARE - {}".format(JSD, EMD, ARE, diff.sum() / max_sum))
    return float(ARE)