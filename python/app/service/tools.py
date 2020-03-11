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
    p = np.array(p).flatten()
    q = np.array(q).flatten()

    JSD = distance.jensenshannon(p, q, 2.0)
    EMD = wasserstein_distance(p, q)
    ARE = calc_are(p, q)

    print("accuray: JSD - {}; EMD - {}, ARE - {}".format(JSD, EMD, ARE))